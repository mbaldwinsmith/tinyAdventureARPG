export interface CatalogueSource {
  archive: string;
  path: string;
  bytes: number;
  sha256: string;
}
export interface CatalogueAsset {
  id: string;
  auditId: string;
  sha256: string;
  width: number;
  height: number;
  category: string;
  identity: string;
  groups: string[];
  relatedGroups: string[];
  suggestedUse: string;
  notes: string[];
  suggestedCell: number[] | null;
  framingBasis: string;
  versionPolicy: string;
  preferredSource: CatalogueSource;
  sources: CatalogueSource[];
}
export interface SpriteCatalogue {
  version: 1;
  auditDate: string;
  counts: {
    archives: number;
    file_entries: number;
    png_entries: number;
    unique_pngs: number;
    support_text_entries: number;
    duplicate_png_occurrences: number;
  };
  archives: {
    name: string;
    sha256: string;
    bytes: number;
    files: number;
    pngs: number;
    identicalArchives: string[];
  }[];
  assets: CatalogueAsset[];
  inventory: {
    archive: string;
    path: string;
    bytes: number;
    sha256: string;
    assetId: string | null;
  }[];
}
