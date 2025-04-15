import { useState, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import styled from "styled-components";
import { getContract } from "../utils/contract";
import { ethers } from "ethers";

const Heading = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.heading};
  font-weight: bold;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const WelcomeCard = styled.div`
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.radii.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const WelcomeText = styled.p`
  font-size: 1.25rem;
  font-weight: 500;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const StatCard = styled.div`
  background-color: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.radii.md};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing.sm};
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const Card = styled.div`
  background-color: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.radii.md};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const CardTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.cardTitle};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const CardText = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.875rem;
`;

const Link = styled(RouterLink)`
  color: ${({ theme }) => theme.colors.secondary};
  text-decoration: underline;
  font-size: 0.875rem;
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const Spinner = styled.div`
  width: 2rem;
  height: 2rem;
  border: 4px solid ${({ theme }) => theme.colors.textSecondary};
  border-top: 4px solid ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto;
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 1rem;
  text-align: center;
  margin: ${({ theme }) => theme.spacing.md} 0;
`;

const Button = styled.button`
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing.xs};
  border: none;
  border-radius: ${({ theme }) => theme.radii.md};
  font-weight: 500;
  cursor: pointer;
  &:hover {
    background-color: ${({ theme }) => theme.colors.secondary};
  }
`;

function StudentDashboard() {
  const [student, setStudent] = useState(null);
  const [gpa, setGpa] = useState(null);
  const [loading, setLoading] = useState(true);
  const [studentId, setStudentId] = useState(null);
  const [error, setError] = useState(null);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(false);

  const BASE_SEPOLIA_CHAIN_ID = "0x14a34"; // Chain ID 84532 in hex

  const checkWalletAndNetwork = async () => {
    if (!window.ethereum) {
      setError("No Ethereum provider found. Please install MetaMask or another wallet.");
      setLoading(false);
      return false;
    }

    try {
      // Check if wallet is connected
      const accounts = await window.ethereum.request({ method: "eth_accounts" });
      if (accounts.length === 0) {
        console.log('No accounts found');
        setError("No signer available. Please connect your wallet.");
        setIsWalletConnected(false);
        setLoading(false);
        return false;
      }
      setIsWalletConnected(true);

      // Check if the wallet is on the correct network (Base Sepolia)
      const chainId = await window.ethereum.request({ method: "eth_chainId" });
      if (chainId !== BASE_SEPOLIA_CHAIN_ID) {
        setError("Please switch to the Base Sepolia network (Chain ID: 84532).");
        setIsCorrectNetwork(false);
        setLoading(false);
        return false;
      }
      setIsCorrectNetwork(true);
      return true;
    } catch (err) {
      setError("Failed to check wallet or network status. Please try again.");
      setLoading(false);
      return false;
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      setError("No Ethereum provider found. Please install MetaMask or another wallet.");
      return;
    }

    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      setError(null);
      setIsWalletConnected(true);
      checkNetworkAndFetch();
    } catch (err) {
      setError("Failed to connect wallet. Please try again.");
    }
  };

  const switchNetwork = async () => {
    if (!window.ethereum) {
      setError("No Ethereum provider found. Please install MetaMask or another wallet.");
      return;
    }

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: BASE_SEPOLIA_CHAIN_ID }],
      });
      setError(null);
      setIsCorrectNetwork(true);
      fetchStudent();
    } catch (switchError) {
      // If the network isn't available in MetaMask, add it
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: BASE_SEPOLIA_CHAIN_ID,
                chainName: "Base Sepolia",
                rpcUrls: ["https://sepolia.base.org"],
                nativeCurrency: {
                  name: "ETH",
                  symbol: "ETH",
                  decimals: 18,
                },
                blockExplorerUrls: ["https://sepolia.basescan.org"],
              },
            ],
          });
          setError(null);
          setIsCorrectNetwork(true);
          fetchStudent();
        } catch (addError) {
          setError("Failed to add Base Sepolia network. Please add it manually.");
        }
      } else {
        setError("Failed to switch to Base Sepolia network. Please try again.");
      }
    }
  };

  const fetchStudent = async () => {
    setLoading(true);
    setError(null);
    try {
      // Get the signer directly from the provider
      if (!window.ethereum) {
        throw new Error("No Ethereum provider found");
      }
      
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const signerAddress = await signer.getAddress();
      
      // Now get the contract
      const contract = await getContract();
      
      const studentCount = await contract.studentCount();

      // Loop through all students to find the one matching the signer's wallet
      // Lets force student for now
      const data = await contract.getStudentData(1);
      let studentData = data;
      let foundStudentId = 1;
        // Uncomment this block to loop through all students
    //   let studentData = null;
    //   let foundStudentId = null;
    //   for (let i = 0; i < Number(studentCount); i++) {
    //     const data = await contract.getStudentData(i);
    //     if (data.wallet.toLowerCase() === signerAddress.toLowerCase() && data.exists) {
    //       studentData = data;
    //       foundStudentId = i;
    //       break;
    //     }
    //   }

      // Rest of your function remains the same
      if (!studentData) {
        throw new Error("No student found for this wallet address.");
      }

      setStudent({
        name: studentData.name,
        age: studentData.age,
        wallet: studentData.wallet,
        courses: studentData.courses,
      });
      setStudentId(foundStudentId);

      const gpaData = await contract.getGPA(foundStudentId);
      setGpa((Number(gpaData) / 100).toFixed(2));
    } catch (error) {
      console.error("Error fetching student data:", error);
      setError(error.message || "Failed to fetch student data.");
    } finally {
      setLoading(false);
    }
  };

  const checkNetworkAndFetch = async () => {
    const isReady = await checkWalletAndNetwork();
    if (isReady) {
      fetchStudent();
    }
  };

  useEffect(() => {
    checkNetworkAndFetch();
  }, []);

  if (error) {
    return (
      <div>
        <ErrorMessage>{error}</ErrorMessage>
        {!isWalletConnected && (
          <Button onClick={connectWallet}>Connect Wallet</Button>
        )}
        {isWalletConnected && !isCorrectNetwork && (
          <Button onClick={switchNetwork}>Switch to Base Sepolia</Button>
        )}
      </div>
    );
  }

  if (loading || !student) return <Spinner />;

  return (
    <div>
      <WelcomeCard>
        <WelcomeText>Welcome back, {student.name} 👋</WelcomeText>
        <CardText>You've completed {student.courses.length} courses this semester!</CardText>
      </WelcomeCard>

      <StatsGrid>
        <StatCard>
          <StatValue>{student.courses.length}/5</StatValue>
          <StatLabel>Courses</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{student.age}</StatValue>
          <StatLabel>Age</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{gpa || "N/A"}</StatValue>
          <StatLabel>GPA</StatLabel>
          <Link to={`/student/${studentId}`}>Go to report</Link>
        </StatCard>
      </StatsGrid>

      <Grid>
        <Card>
          <CardTitle>Courses</CardTitle>
          {student.courses.map((course, index) => (
            <CardText key={index}>
              {course.name} - Credits: {course.credits}, Grade: {course.grade}
            </CardText>
          ))}
          <Link to={`/courses/${studentId}`}>Manage Courses</Link>
        </Card>
        <Card>
          <CardTitle>Student Info</CardTitle>
          <CardText>Name: {student.name}</CardText>
          <CardText>Wallet: {student.wallet.slice(0, 6)}...{student.wallet.slice(-4)}</CardText>
          <Link to={`/student/${studentId}`}>More details</Link>
        </Card>
      </Grid>
    </div>
  );
}

export default StudentDashboard;