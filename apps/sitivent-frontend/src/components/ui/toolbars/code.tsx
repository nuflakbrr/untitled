'use client';

import React from "react";
import { cn } from "@/lib/utils";
import { Code2 } from "lucide-react";
import { getModKey } from "@/lib/os";
import { Button, type ButtonProps } from "@/components/ui/button";
import { useToolbar } from "@/components/ui/toolbars/toolbar-provider";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";

const CodeToolbar = React.forwardRef<HTMLButtonElement, ButtonProps>(
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
							editor?.isActive("code") && "bg-accent",
							className,
						)}
						onClick={(e) => {
							editor?.chain().focus().toggleCode().run();
							onClick?.(e);
						}}
						disabled={!editor?.can().chain().focus().toggleCode().run()}
						ref={ref}
						{...props}
					>
						{children || <Code2 className="h-4 w-4" />}
					</Button>
				</TooltipTrigger>
				<TooltipContent>
					<p>Code ({getModKey()} + E)</p>
				</TooltipContent>
			</Tooltip>
		);
	},
);

CodeToolbar.displayName = "CodeToolbar";

export { CodeToolbar };
