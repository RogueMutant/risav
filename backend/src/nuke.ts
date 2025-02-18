import User from "./model/User";
export const nuke = async () => {
  try {
    const result = await User.deleteMany();
    console.log("succesfully nuked the DB", result.deletedCount);
    return;
  } catch (error) {
    console.log("Failed to nuke DB");
    process.exit(0);
  }
};
