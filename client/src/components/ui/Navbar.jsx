import { Menu, School } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Button } from "./button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import DarkMode from "@/DarkMode";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./sheet";

import { Separator } from "@radix-ui/react-dropdown-menu";
import { Link, useNavigate } from "react-router-dom";
import { useLogoutUserMutation } from "@/features/api/authApi";
import { toast } from "sonner";
import { useSelector } from "react-redux";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const [logoutUser, { data, isSuccess }] = useLogoutUserMutation();
  const navigate = useNavigate();

  const logoutHandler = async () => {
    await logoutUser();
  };
  useEffect(() => {
    if (isSuccess) {
      toast.success(data.message || "Logged out");
      navigate("/");
    }
  }, [isSuccess]);

  return (
    <div className="h-16 dark:bg-[#0A0A0A] bg-white border-b dark:border-b-gray-800 border-b-gray-200 fixed top-0 left-0 right-0 duration-300 z-10">
      <div className="max-w-6xl hidden mx-auto md:flex justify-between items-center gap-10 h-full">
        <div className="flex items-center gap-2">
          <School size={30} />
          <Link to="/">
            <h1 className="hidden md:block font-extrabold text-xl">
              E-Learning
            </h1>
          </Link>
        </div>
        <div className="flex items-center gap-8">
          {user ? (
            <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
              <DropdownMenuTrigger>
                <Avatar>
                  <AvatarImage
                    src={user.photoUrl || "https://github.com/shadcn.png"}
                    alt="@shadcn"
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <Link to="my-learning">My learning</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link to="profile">Edit Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logoutHandler}>
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                {user.role === "instructor" && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Link to='/admin/dashboard'>Dashboard</Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={() => navigate("/login")}>
                  Login
                </Button>
                <Button onClick={() => navigate("/login")}>Signup</Button>
              </div>
            </>
          )}
          <DarkMode />
        </div>
      </div>
      {/* Mobile device */}
      <div className="flex md:hidden items-center justify-between px-4 h-full">
        <h1 className="font-extrabold text-xl"><Link to='/'>E-learning</Link></h1>
        <MobileNavbar user={user} logoutHandler={logoutHandler} />
      </div>
    </div>
  );
};

export default Navbar;
const MobileNavbar = ({user,logoutHandler}) => {
  const navigate=useNavigate();
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          size="icon"
          className="rounded-full"
          variant="outline"
        >
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col p-10">
        <SheetHeader className="flex flex-row items-center justify-between">
          <SheetTitle><Link to='/'>E-Learning</Link></SheetTitle>
          <DarkMode />
        </SheetHeader>
        <Separator className="mr-2" />
        <nav className="flex flex-col space-y-4">
          <Link to='/my-learning'>My Learning</Link>
          <Link to='/profile'>Edit Profile</Link>
          <div onClick={logoutHandler}>Logout</div>
        </nav>

        {user?.role === "instructor" && (
          <SheetFooter>
            <SheetClose asChild>
              <Button type="submit" onClick={()=>navigate('/admin/dashboard')}>Dashboard</Button>
            </SheetClose>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
};
