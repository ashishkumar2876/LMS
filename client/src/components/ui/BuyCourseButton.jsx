import React, { useEffect } from "react";
import { Button } from "./button";
import { useCreateCheckoutSessionMutation, useGetCourseDetailWithStatusQuery } from "@/features/api/purchaseApi";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const BuyCourseButton = ({courseId, purchased: purchasedProp}) => {
  const [createCheckoutSession,{data,isLoading,isSuccess,isError,error}]=useCreateCheckoutSessionMutation();
  
  // Check if course is already purchased (use prop if provided, otherwise fetch)
  const {data:purchaseData} = useGetCourseDetailWithStatusQuery(courseId, {
    skip: !courseId || purchasedProp !== undefined, // Skip if purchased prop is provided
  });
  
  const isPurchased = purchasedProp !== undefined ? purchasedProp : (purchaseData?.purchased || false);

  const purchaseCourseHandler=async ()=>{
    if (isPurchased) {
      toast.info("You have already purchased this course");
      return;
    }
    await createCheckoutSession(courseId);
  }

  useEffect(()=>{
    if(isSuccess){
      if(data?.url){
        window.location.href=data.url;
      }
      else{
        toast.error('Invalid response from server');
      }
    }
    if(isError){
      toast.error(error?.data?.message || "Failed to create checkout");
    }
  },[data,isSuccess,isError,error])
  
  return <Button 
    disabled={isLoading || isPurchased} 
    onClick={purchaseCourseHandler} 
    className="w-full"
  >
    {
      isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
          Processing...
        </>
      ) : isPurchased ? (
        "Already Purchased"
      ) : (
        "Purchase Course"
      )
    }
  </Button>
}
export default BuyCourseButton;
