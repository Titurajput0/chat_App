
// export const setTypingStatus = async (chatId, email, isTyping) => {
//   try {
//     if (!chatId || !email) {
//       console.warn("Skipping typing update — missing chatId or email");
//       return;
//     }

//     const safeEmail = email.replace(/[.@]/g, "_");

//     await updateDoc(doc(db, "chats", chatId), {
//       [`typing.${safeEmail}`]: isTyping
//     });

//     console.log(`Typing status updated for ${email}: ${isTyping}`);
//   } catch (error) {
//     console.error("Error updating typing status:", error);
//   }
// };

export const setTypingStatus = async (chatId, email, isTyping) => {
  try {
    if (!chatId || !email) {
      console.warn("Skipping typing update — missing chatId or email");
      return;
    }

    // Firestore जैसा safe key बनाओ
    const safeEmail = email.replace(/[.@]/g, "_");

    // Supabase JSONB merge update
    const { error } = await supabase
      .from("chats")
      .update({
        typing: {
          [safeEmail]: isTyping
        }
      })
      .eq("id", chatId);

    if (error) {
      console.error("❌ Error updating typing status:", error);
    } else {
      console.log(`✅ Typing status updated for ${email}: ${isTyping}`);
    }
  } catch (err) {
    console.error("❌ setTypingStatus error:", err);
  }
};