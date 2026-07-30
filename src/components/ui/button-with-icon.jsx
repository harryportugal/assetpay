import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";

const ButtonWithIcon = ({ 
  children, 
  text, 
  icon: Icon = ArrowUpRight, 
  className = "", 
  ...props 
}) => {
  const content = text || children || "Let's Collaborate";
  
  return (
    <Button 
      className={`relative text-sm font-semibold rounded-full h-12 p-1 ps-6 pe-14 group transition-all duration-500 hover:ps-14 hover:pe-6 w-fit overflow-hidden cursor-pointer bg-[#3F6DF7] text-[#F5F5F7] hover:bg-[#5C84FF] border-none shadow-md ${className}`}
      {...props}
    >
      <span className="relative z-10 transition-all duration-500 whitespace-nowrap">
        {content}
      </span>
      <div className="absolute right-1 w-10 h-10 bg-[#09090B] text-[#F5F5F7] rounded-full flex items-center justify-center transition-all duration-500 group-hover:right-[calc(100%-44px)] group-hover:rotate-45 shrink-0">
        <Icon size={16} className="stroke-[2.5px]" />
      </div>
    </Button>
  );
};

export default ButtonWithIcon;
