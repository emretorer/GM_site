import admin from "firebase-admin";

const batchGetPlayerMetrics = async (studentIds) => {
  if (!studentIds || studentIds.length === 0) return {};

  try {
    const playerMetricsPromises = studentIds.map((studentId) =>
      admin.firestore().collection("PlayerMetrics").doc(studentId).get()
    );

    const playerMetricsSnapshots = await Promise.all(playerMetricsPromises);
    const playerMetricsMap = {};

    playerMetricsSnapshots.forEach((snapshot, index) => {
      const studentId = studentIds[index];
      if (snapshot.exists) {
        playerMetricsMap[studentId] = snapshot.data();
      }
    });

    return playerMetricsMap;
  } catch (error) {
    console.error("Batch PlayerMetrics cekme hatasi:", error);
    return {};
  }
};

export { batchGetPlayerMetrics };
