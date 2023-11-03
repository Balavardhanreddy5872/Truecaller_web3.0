import React, { useEffect, useState } from 'react';

import { ethers } from 'ethers';

import { contractABI, contract_Address } from '../utils/constant';

export const TruecallerContext = React.createContext();

const { ethereum } = window;

// creating ethereum contract 
const getEthereumContract = () => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const Signer = provider.getSigner();
    const truecallerContract = new ethers.Contract(contract_Address, contractABI, Signer);

    return truecallerContract;
}

export const Transactionprovider = ({ children }) => {
    const [currentAccount, setCurrentAccount] = useState("");

    /*<------------------------------------------ Adds to TrueCaller  form------------------------------------------------------------>.*/
    const [formData, setformData] = useState({ email: '', mobileNumber: '', Name: '' });
    // handle change for the form 
    const handleChange = (e, name) => {
        setformData((prevState) => ({ ...prevState, [name]: e.target.value }));
    };
    /*<------------------------------------------Adds to TrueCaller  form------------------------------------------------------------>.*/
    /*<------------------------------------------ Search a Number state ------------------------------------------------------------>.*/
    const [data, setData] = useState({ search: "" });
    const handlesearch = (e, name) => {
        setData((prevState) => ({ ...prevState, [name]: e.target.value }));
    }
    /*<------------------------------------------Search a Number state ------------------------------------------------------------>.*/


    //<--------- Main ----------------->
    // 2.Checking if wallet is connected.
    const checkIfWalletIsConnected = async () => {
        try {
            if (!ethereum) return alert("please Install metamask");
            const accounts = await ethereum.request({ method: 'eth_accounts' });
            if (accounts.length) {
                setCurrentAccount(accounts[0]);
            } else {
                console.log('No account Found')
            }
        } catch (error) {
            console.log(error);
        }


    }

    /*<------------------------------------------ 1.connecting to Metamask wallet ------------------------------------------------------------>.*/
    const connectWallet = async () => {
        try {
            if (!ethereum) return alert("please Install metamask");
            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
            setCurrentAccount(accounts[0]);
        } catch (error) {
            console.log(error);
        }
    }

    /*<------------------------------------------3.Adds to TrueCaller ------------------------------------------------------------>.*/
    const AddCaller = async () => {

        try {
            if (ethereum) {
                const { Name, email, mobileNumber } = formData;
                const transaction = getEthereumContract();
                const estimatedGas = await transaction.estimateGas.setCaller(mobileNumber, Name, email);
                const gasLimit = estimatedGas.mul(120).div(100);

                if (mobileNumber) {
                    console.log(mobileNumber);

                    await ethereum.request({
                        method: "eth_sendTransaction",
                        params: [{
                            from: currentAccount,
                            to: contract_Address,
                            gas: "0x1555208",
                            gasLimit: gasLimit
                        }],
                    });

                    const transactionHash = await transaction.setCaller(Name, email, mobileNumber);

                    console.log(`Loading - ${transactionHash.hash}`);
                    await transactionHash.wait();
                    console.log(`Success - ${transactionHash.hash}`);
                    alert("Added to Truecaller");
                } else {
                    console.log("Mobile is undefined or empty.");
                }


            } else {
                console.log("Ethereum is not present");
            }

        } catch (error) {
            console.log('failed to add to blockchain');
            console.log(error)

        }
    };
    /*<------------------------------------------Adds to TrueCaller  form------------------------------------------------------------>.*/


    /*<------------------------------------------4. Search a Number ------------------------------------------------------------>.*/

    const [searchResult, setSearchResult] = useState([]); // Define state for search results
    const searchNumber = async () => {
        try {

            if (ethereum) {
                const transaction = getEthereumContract();
                const callerArray = await transaction.getAllCallerInfo();

                const allnumber = callerArray.map((number) => ({
                    Name: number.mobileNumber,
                    Number: number.email,
                    email: number.name,
                    spam: number.isSpam,
                    spamcount: number.spamCount
                }));

                setSearchResult(allnumber); // Update the state with search results
                console.log(allnumber);
            }
        } catch (error) {
            console.log(error);
        }
    }
    /*<------------------------------------------Search a Number ------------------------------------------------------------>.*/

    const [spamresult, setSpamresult] = useState([]);
    const spamsearchNumber = async () => {
        try {
            if (ethereum) {
                const transaction = getEthereumContract();
                const spamCallers = await transaction.getAllSpamNumbers();

                const spamNumbers = spamCallers[0].map((number, index) => ({
                    mobileNumber: number, // Use number here instead of spamCallers[0][index]
                    name: spamCallers[1][index],
                    email: spamCallers[2][index],
                    isSpam: spamCallers[3][index],
                    spamCount: spamCallers[4][index],
                }));

                setSpamresult(spamNumbers);
                console.log(spamresult);
            }
        } catch (error) {
            console.error('Error fetching spam numbers:', error);
        }
    }


    useEffect(() => {
        checkIfWalletIsConnected();
        // Searchcaller();
    }, []);
    return (
        <TruecallerContext.Provider value={{ connectWallet, currentAccount, formData, handleChange, AddCaller, data, handlesearch, searchNumber, searchResult,spamsearchNumber }}>
            {children}
        </TruecallerContext.Provider>
    );
}