export {};

type Role = "admin" | "super_admin" | "member";

function arg(name: string) {
  const prefix = `${name}=`;
  const inline = process.argv.find((item) => item.startsWith(prefix));
  if (inline) return inline.slice(prefix.length);
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

async function main() {
  if (process.env.CI) throw new Error("Refusing to run admin bootstrap in CI.");
  if (!process.argv.includes("--confirm-admin-bootstrap")) throw new Error("Missing --confirm-admin-bootstrap.");
  if (!process.env.GOOGLE_APPLICATION_CREDENTIALS && !process.env.FIRESTORE_EMULATOR_HOST) throw new Error("Firebase Admin credentials are required. Set GOOGLE_APPLICATION_CREDENTIALS, or use FIRESTORE_EMULATOR_HOST for emulator rehearsal.");

  const email = arg("--email");
  const uidArg = arg("--uid");
  const role = (arg("--role") || "admin") as Role;
  if (!email && !uidArg) throw new Error("Provide --email or --uid.");
  if (!["admin", "super_admin", "member"].includes(role)) throw new Error("--role must be admin, super_admin, or member.");

  const admin = (await (Function("moduleName", "return import(moduleName)"))("firebase-admin")) as any;
  if (!admin.apps.length) {
    admin.initializeApp(process.env.GOOGLE_APPLICATION_CREDENTIALS ? { credential: admin.credential.applicationDefault() } : undefined);
  }

  const user = uidArg ? await admin.auth().getUser(uidArg) : await admin.auth().getUserByEmail(email!);
  await admin.firestore().collection("users").doc(user.uid).set({
    uid: user.uid,
    email: user.email || email || null,
    role,
    status: "active",
    profileComplete: true,
    adminBootstrappedAt: admin.firestore.FieldValue.serverTimestamp(),
    adminBootstrappedBy: "scripts/bootstrap-admin.ts",
  }, { merge: true });

  console.log(`Updated users/${user.uid} (${user.email || email || "no-email"}) with role=${role}, status=active, profileComplete=true. No secrets were printed.`);
}

main().catch((error) => {
  console.error("Admin bootstrap failed safely.");
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
