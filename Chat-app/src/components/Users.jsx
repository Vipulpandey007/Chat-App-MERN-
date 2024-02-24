import Avatar from "./Avatar";

const Users = ({ id, onClick, selectedPeople, email, online }) => {
  return (
    <div
      onClick={() => onClick(id)}
      className={
        "border-b border-gray-100  flex items-center gap-2 cursor-pointer " +
        (id === selectedPeople ? "bg-blue-50" : "")
      }
    >
      {selectedPeople && (
        <div className="w-1 bg-blue-500 h-12 rounded-r-md"></div>
      )}
      <div className="flex gap-2 py-2 pl-4 items-center">
        <Avatar online={online} email={email} userId={id} />
        <span className="text-gray-700">{email}</span>
      </div>
    </div>
  );
};
export default Users;
