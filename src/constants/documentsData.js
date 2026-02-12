// src/constants/documentsData.js
// ============================================
// DOCUMENT CONFIGURATION FILE
// ============================================
// To add a new document:
//   1. Add your document image to /public/documents/
//   2. Add a new object to the DOCUMENTS array below
//   3. Save this file - the website will automatically show the new document
//
// To remove a document:
//   1. Delete the object from the DOCUMENTS array
//   2. Optionally remove the image from /public/documents/
//
// Fields:
//   - id: Unique identifier (number) - make sure each document has a unique id
//   - name: Display name shown under the folder icon and on the document view
//   - src: Path to the document image (relative to public folder)
//   - description: Short description shown on hover (keep it concise, 1-2 lines)
//   - category: Optional category for organization (e.g., "Legal", "Brochure", "Permits")
//   - dateAdded: Optional date string for reference
// ============================================

export const DOCUMENTS = [
  {
    id: 1,
    name: "Floor Plan Overview",
    src: "/documents/floor-plan-overview.png",
    description: "Complete floor plan layout with dimensions and room specifications.",
    category: "Plans",
    dateAdded: "2024-01-15",
  },
  {
    id: 2,
    name: "Legal Agreement",
    src: "/documents/legal-agreement.jpg",
    description: "Terms and conditions document for property purchase agreement.",
    category: "Legal",
    dateAdded: "2024-01-20",
  },
  {
    id: 3,
    name: "Amenities Brochure",
    src: "/documents/amenities-brochure.webp",
    description: "Detailed brochure showcasing all premium amenities and facilities.",
    category: "Brochure",
    dateAdded: "2024-02-01",
  },
  {
    id: 4,
    name: "Payment Schedule",
    src: "/documents/payment-schedule.png",
    description: "Comprehensive payment plan with milestone-based installments.",
    category: "Financial",
    dateAdded: "2024-02-10",
  },
  {
    id: 5,
    name: "Site Approval",
    src: "/documents/site-approval.jpg",
    description: "Government approved site clearance and construction permits.",
    category: "Permits",
    dateAdded: "2024-02-15",
  },
];

// ============================================
// CONFIGURATION OPTIONS
// ============================================
export const DOCUMENTS_CONFIG = {
  // Maximum number of documents supported
  maxDocuments: 50,
  
  // Default folder icon color (matches theme)
  folderColor: "#C19A40",
  
  // Animation durations (in seconds)
  animations: {
    folderHover: 0.3,
    dropdownOpen: 0.4,
    documentOpen: 0.5,
    documentSwitch: 0.4,
  },
  
  // Supported image formats
  supportedFormats: [".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg"],
};