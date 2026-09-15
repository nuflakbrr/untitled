'use client';

import type { Extension } from "@tiptap/core";
import type { StarterKitOptions } from "@tiptap/starter-kit";

import React from "react";
import { cn } from "@/lib/utils";
import { getModKey } from "@/lib/os";
import { BoldIcon } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { useToolbar } from "@/components/ui/toolbars/toolbar-provider";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";

type StarterKitExtensions = Extension<StarterKitOptions, any>;

const BoldToolbar = React.forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, onClick, children, ...props }, ref) => {
		const { editor } = useToolbar();
		return (
			<Tooltip>
				<TooltipTrigger asChild>
					<Button
						variant="ghost"
						size="icon"
						className={cn(
							"h-8 w-8",
							editor?.isActive("bold") && "bg-accent",
							className,
						)}
						onClick={(e) => {
							editor?.chain().focus().toggleBold().run();
							onClick?.(e);
						}}
						disabled={!editor?.can().chain().focus().toggleBold().run()}
						ref={ref}
						{...props}
					>
						{children || <BoldIcon className="h-4 w-4" />}
					</Button>
				</TooltipTrigger>
				<TooltipContent>
					<p>Bold ({getModKey()} + B)</p>
				</TooltipContent>
			</Tooltip>
		);
	},
);

BoldToolbar.displayName = "BoldToolbar";

export { BoldToolbar };
