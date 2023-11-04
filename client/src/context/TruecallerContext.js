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


    //////

    const addSpam = async (phoneNumber) => {
        const contract = getEthereumContract()
        const estimatedGas = await contract.estimateGas.reportSpam(phoneNumber);
        const gasLimit = estimatedGas.mul(120).div(100);
        await ethereum.request({
            method: "eth_sendTransaction",
            params: [{
                from: currentAccount,
                to: contract_Address,
                gas: "0x1555208",
                gasLimit: gasLimit
            }],
        });
        const txn = await contract.reportSpam(phoneNumber);
        const receipt = await txn.wait();
        if (receipt.status === 1) {
            // Update the caller array with 'Yes' for isSpam and set spamCount to 1
            const callerArray = await contract.getAllCallerInfo();
            callerArray.forEach((caller) => {
                if (caller.mobileNumber === phoneNumber) {
                    caller.isSpam = 'yes';
                    caller.spamCount = 1;
                }
            });
    
            // Log that spam has been reported
            console.log('Spam reported');
            console.log(callerArray); // Log the updated caller array
        }
        console.log(phoneNumber);

         
    }

    const getAllSpam = async () => {
        const contract = getEthereumContract()
        // const numbers = await contract.returnSpamNumbersWithInfo()

        const numbers = await contract.getAllSpamNumbers();
        console.log(numbers)
        return numbers;
    }

    useEffect(() => {
        checkIfWalletIsConnected();
        // Searchcaller();
    }, []);
    return (
        <TruecallerContext.Provider value={{ connectWallet, currentAccount, formData, handleChange, AddCaller, data, addSpam, getAllSpam, handlesearch, searchNumber, searchResult }}>
            {children}
        </TruecallerContext.Provider>
    );
}