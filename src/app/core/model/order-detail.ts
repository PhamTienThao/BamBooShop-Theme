import { Attribute } from "./attribute";
import { Review } from "./review";

export interface OrderDetail {
    Id?: number;
    OrderId?: number;
    ProductId: number;
    ProductName: string;
    ProductImage: string;
    ImageCloudLink: string;
    ProductPrice: number;
    ProductDiscountPrice: number;
    Qty: number;
    Attribute?: string;

    Reviews?: Review[];

    ProductAlias?: string;
    Attributes: Attribute[];
    IsReview?: boolean;
    QtyRemain: number;
}
