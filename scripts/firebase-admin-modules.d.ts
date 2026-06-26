declare module "firebase-admin/app" {
  export function getApps(): unknown[];
  export function initializeApp(options?: unknown): unknown;
  export function applicationDefault(): unknown;
}
declare module "firebase-admin/firestore" {
  export function getFirestore(): unknown;
  export const FieldValue: { delete(): unknown };
}
