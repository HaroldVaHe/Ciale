import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const WHATSAPP_NUMBER = "573203039847";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCOP(value: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(value);
}

export interface WhatsAppOrderDetails {
  items: {
    name: string;
    quantity: number;
    variant?: string;
    initial?: string;
  }[];
  total: number;
  address?: string;
  orderRef?: string;
  notes?: string;
}

export function generateWhatsAppLink(
  phone: string,
  { items, total, address, orderRef, notes }: WhatsAppOrderDetails
): string {
  const productList = items
    .map((item) => {
      let line = `- ${item.name} x${item.quantity}`;
      if (item.variant) line += ` (${item.variant})`;
      if (item.initial) line += ` [Inicial: ${item.initial}]`;
      return line;
    })
    .join("\n");

  const message = encodeURIComponent(
    `Hola CIALÉ! Me gustaría realizar el siguiente pedido:${
      orderRef ? `\n\nPedido: ${orderRef}` : ""
    }\n\n${productList}\n\nTotal: ${formatCOP(total)}${
      address ? `\nDirección de entrega: ${address}` : ""
    }${notes ? `\nDetalles adicionales: ${notes}` : ""}\n\n¡Gracias!`
  );

  return `https://wa.me/${phone}?text=${message}`;
}
