import React, { ElementType } from "react";

// Basic renderer for Strapi Blocks
export const BlocksRenderer = ({ content }: { content: any }) => {
    if (!content) return null;

    // Handle if content is string (legacy)
    if (typeof content === "string") {
        return <p className="text-muted-foreground whitespace-pre-wrap">{content}</p>;
    }

    // Handle array of blocks
    if (Array.isArray(content)) {
        return (
            <div className="space-y-4 text-muted-foreground">
                {content.map((block: any, index: number) => {
                    switch (block.type) {
                        case "paragraph":
                            return (
                                <p key={index}>
                                    {block.children?.map((child: any, childIndex: number) => child.text).join("")}
                                </p>
                            );
                        case "heading":
                            const level = block.level || 3;
                            const Tag = `h${level}` as ElementType;
                            return (
                                <Tag key={index} className="font-semibold text-foreground">
                                    {block.children?.map((child: any, childIndex: number) => child.text).join("")}
                                </Tag>
                            )
                        case "list":
                            const ListTag = block.format === 'ordered' ? 'ol' : 'ul';
                            return (
                                <ListTag key={index} className={`list-inside ${block.format === 'ordered' ? 'list-decimal' : 'list-disc'}`}>
                                    {block.children?.map((item: any, itemIndex: number) => (
                                        <li key={itemIndex}>
                                            {item.children?.map((child: any) => child.text).join("")}
                                        </li>
                                    ))}
                                </ListTag>
                            )
                        default:
                            return null;
                    }
                })}
            </div>
        );
    }

    return null;
};
