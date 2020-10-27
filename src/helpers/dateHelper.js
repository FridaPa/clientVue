export default {
  dateToyymmddFormat(item) {
    let date = new Date(item);
    return date.toLocaleDateString("sv-SE", {});
  },
  convertToApiDate(date) {
    let d = new Date(date);
    return `${d.getFullYear()}${('0' + (d.getMonth() + 1)).slice(-2)}${('0' + d.getDate()).slice(-2)}`;
  },
  dateToTimeStamp(item) {
    if (item == null)
      return null;
    let date = new Date(item);
    return date.toLocaleTimeString("sv-SE", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    });
  },
}