/** Official SokoTZ contact details (provided by the owner). */
export const CONTACT = {
  phone: "+255665926575",
  phoneDisplay: "+255 665 926 575",
  whatsapp: "+255695516575",
  whatsappDisplay: "+255 695 516 575",
  email: "sokoTZ29@gmail.com",
} as const;

export const whatsappLink = `https://wa.me/${CONTACT.whatsapp.replace(/\D/g, "")}`;
