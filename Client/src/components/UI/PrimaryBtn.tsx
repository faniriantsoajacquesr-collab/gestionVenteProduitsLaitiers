import React from "react";

export default function PrimaryBtn({
    displayText,
    icon,
    onClick,
}: {
    displayText: string;
    icon?: React.ReactNode;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
}) {
    return (
        <button
            className="w-full creamy-gradient text-on-primary font-bold py-5 rounded-full hover:scale-[1.02] hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
            type={onClick ? "button" : "submit"}
            onClick={onClick}
        >
            {icon}
            {displayText}
        </button>
    );
}