import React, {useEffect} from 'react';
import axiosInstance from "../../utils/axiosInstance.js";
import {API_PATHS} from "../../utils/apiPaths.js";
import {LuUsers} from "react-icons/lu";
import Modal from "../layouts/Modal.jsx";
import AvatarGroup from "../display/AvatarGroup.jsx";

const SelectUsers = ({selectedUsers, onChange}) => {
  const [allUsers, setAllUsers] = React.useState([]);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [tempSelectedUsers, setTempSelectedUsers] = React.useState([]);

  const getAllUsers = async () => {
    try{
      const response = await axiosInstance.get(API_PATHS.USERS.GET_ALL_USERS);
      if (response && response.data?.length > 0) {
        setAllUsers(response.data);
        console.log(allUsers)
      }
    }catch (error) {
      console.error("Error fetching users", error);
    }
  }

  const toggleUserSelection = (userId) => {
    setTempSelectedUsers((prevState) => prevState.includes(userId) ? prevState.filter((id) => id !== userId) : [...prevState, userId]);
  }

  const handleAssign = () => {
    onChange(tempSelectedUsers);
    setIsModalOpen((prevState) => !prevState);
  }

  const selectedUserAvatars = allUsers
    .filter((user) => selectedUsers.includes(user._id))
    .map((user) => user.profileImageUrl);

  useEffect(() => {
    getAllUsers();
  }, []);

  useEffect(() => {
    if (selectedUsers.length === 0) {
      setTempSelectedUsers([]);
    }
    return () => {};
  }, [selectedUsers])

  return (
    <div className="space-y-4 mt-2">
      {selectedUserAvatars.length === 0 && (
        <button className="card-btn" onClick={() => setIsModalOpen(true)}>
          <LuUsers className="text-sm" /> Add Members
        </button>
      )}

      {selectedUserAvatars.length > 0 && (
        <div className="cursor-pointer" onClick={() => setIsModalOpen(true)}>
          <AvatarGroup avatars={selectedUserAvatars} maxVisible={3}/>
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen((prevState) => !prevState)} title="Select Users">
        <div className="space-y-4 h-[60vh] overflow-y-auto">
          {allUsers.map((user) => (
            <div key={user?._id} className="flex items-center gap-4 p-3 border-b border-gray-200">
              <img src={user.profileImageUrl} alt={user.name} className="w-10 h-10 rounded-full"/>
              <div className="flex-1">
                <p className="font-medium text-gray-800 ">{user?.name}</p>
                <p className="text-[13px] text-gray-500 ">{user?.email}</p>
              </div>
              <input type="checkbox" checked={tempSelectedUsers.includes(user._id)}
                     onChange={() => toggleUserSelection(user._id)} className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded-sm outline-none"/>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <button className="card-btn" onClick={() => setIsModalOpen((prevState) => !prevState)}>
            CANCEL
          </button>
          <button className="card-btn-fill" onClick={handleAssign}>DONE</button>
        </div>
      </Modal>
    </div>
  )
};

export default SelectUsers;