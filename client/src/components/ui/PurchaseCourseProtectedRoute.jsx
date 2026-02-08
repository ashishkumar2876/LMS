import { useGetCourseDetailWithStatusQuery } from "@/features/api/purchaseApi";
import { Navigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

const PurchaseCourseProtectedRoute=({children})=>{
    const {courseId}=useParams();
    const {data,isLoading,refetch}=useGetCourseDetailWithStatusQuery(courseId);
    const pollIntervalRef = useRef(null);
    const [isPolling, setIsPolling] = useState(false);
    const pollCountRef = useRef(0);

    // Poll for purchase status (webhook might take a few seconds to process)
    useEffect(() => {
        // If already purchased, stop polling
        if (data?.purchased) {
            if (pollIntervalRef.current) {
                clearInterval(pollIntervalRef.current);
                pollIntervalRef.current = null;
            }
            setIsPolling(false);
            return;
        }

        // Don't start polling if still loading initial data
        if (isLoading) return;

        // Start polling if not purchased
        setIsPolling(true);
        pollCountRef.current = 0;

        // Poll every 2 seconds for up to 15 seconds (7 attempts)
        pollIntervalRef.current = setInterval(() => {
            pollCountRef.current += 1;
            
            // Stop polling after 7 attempts (15 seconds)
            if (pollCountRef.current >= 7) {
                if (pollIntervalRef.current) {
                    clearInterval(pollIntervalRef.current);
                    pollIntervalRef.current = null;
                }
                setIsPolling(false);
                return;
            }
            
            // Refetch to check if purchase status updated
            refetch();
        }, 2000);

        return () => {
            if (pollIntervalRef.current) {
                clearInterval(pollIntervalRef.current);
                pollIntervalRef.current = null;
            }
            pollCountRef.current = 0;
            setIsPolling(false);
        };
    }, [isLoading, data?.purchased, refetch]);
    
    // Show loading while checking or polling
    if (isLoading || isPolling) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <p className="text-lg mb-2">Processing your payment...</p>
                    <p className="text-sm text-gray-500">Please wait while we verify your purchase</p>
                </div>
            </div>
        );
    }

    // If purchased, show the protected content
    if (data?.purchased) {
        return children;
    }

    // Not purchased after polling - redirect to course details
    return <Navigate to={`/course-detail/${courseId}`} replace />
}
export default PurchaseCourseProtectedRoute;