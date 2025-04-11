import { ethers } from "ethers";

const contractAddress = "0x9ADe272f23BE03f01CA9b79740094368beec372C";
const contractABI = [
  "function addStudent(string memory _name, uint8 _age, address payable _wallet) public",
  "function updateStudent(uint256 _studentId, string memory _name, uint8 _age, address payable _wallet) public",
  "function removeStudent(uint256 _studentId) public",
  "function addCourse(uint256 _studentId, string memory _name, uint8 _credits, uint8 _grade) public",
  "function removeCourse(uint256 _studentId, uint256 _courseIndex) public",
  "function getStudentData(uint256 _studentId) public view returns (string memory name, uint8 age, address wallet, tuple(string name, uint8 credits, uint8 grade)[] memory courses, bool exists)",
  "function getGPA(uint256 _studentId) public view returns (uint256)",
  "event StudentAdded(uint256 indexed id, string name, uint8 age, address wallet)",
];

export const getContract = async () => {
  if (!window.ethereum) {
    throw new Error("Please install MetaMask!");
  }
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  return new ethers.Contract(contractAddress, contractABI, signer);
};