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
    const [formData, setformData] = useState({ email: '', mobileNumber: '', Name: '' });
    const handleChange = (e, name) => {
        setformData((prevState) => ({ ...prevState, [name]: e.target.value }));
    };
    const [data, setData] = useState({ search: "" });
    const handlesearch = (e, name) => {
        setData((prevState) => ({ ...prevState, [name]: e.target.value }));
    }

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

    // 1.connecting to Metamask wallet
    const connectWallet = async () => {
        try {
            if (!ethereum) return alert("please Install metamask");
            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
            setCurrentAccount(accounts[0]);
        } catch (error) {
            console.log(error);
        }
    }

    // 3. Adds to TrueCaller 
    const AddCaller = async () => {

        try {
            if (ethereum) {
                const { Name, email, mobileNumber } = formData;
                const transaction = getEthereumContract();
                const estimatedGas = await transaction.estimateGas.setCaller(mobileNumber, Name, email);
                const gasLimit = estimatedGas.mul(120).div(100);

                if (mobileNumber) {
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
                    alert(`Sucess-${transactionHash}, Added to truecaller`);
                } else {
                    console.log("Mobile is undefined or empty.");
                }


            } else {
                console.log("Ethereum is not present");
            }

        } catch (error) {
            alert('failed to add to truecaller');
            console.log(error)

        }
    };

    // 4. Get all Numbers Number

    const [searchResult, setSearchResult] = useState([]);
    const searchNumber = async () => {
        try {

            if (ethereum) {
                const transaction = getEthereumContract();
                const callerArray = await transaction.getAllCallerInfo();

                const allnumber = callerArray.map((number) => ({
                    Name: number.mobileNumber,
                    Number: number.email,
                    email: number.name,
                }));

                setSearchResult(allnumber);
                console.log(allnumber);
            }
        } catch (error) {
            console.log(error);
        }
    }


    //5. Add  a Number to spam 

    const addSpam = async (phoneNumber) => {
        const contract = getEthereumContract();
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
        try {
            const txn = await contract.reportSpam(phoneNumber, { gasLimit });
            const receipt = await txn.wait();
            if (receipt.status === 1) {
                console.log('Spam reported');
            }
            else {
                console.error('Error in Reporting Spam');
            }
        } catch (error) {
            console.error('Error reporting spam:', error);
        }

        console.log(phoneNumber);
    }


    // 6. Removes Numbers from a spam

    const removeSpam = async (phoneNumber) => {
        const contract = getEthereumContract();
        const estimatedGas = await contract.estimateGas.removeSpam(phoneNumber);
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

        try {
            const txn = await contract.removeSpam(phoneNumber, { gasLimit });
            const receipt = await txn.wait();
            if (receipt.status === 1) {
                console.log('Spam removed');
            }
        } catch (error) {
            console.error('Error removing spam:', error);
        }

        console.log(phoneNumber);
    }


    // 7. Search a Number 
    const [search, setSearch] = useState([]);
    const searchValue = async (mobileNumber) => {
        try {
            if (ethereum) {
                const transaction = getEthereumContract();
                const callerArray = await transaction.getAllCallerInfo();

                const filteredData = callerArray.filter((caller) =>
                    caller.email === mobileNumber
                );

                if (filteredData.length > 0) {
                    setSearch(filteredData);
                    console.log(filteredData);
                } else {
                    console.log("Caller not found.");
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    // 8. UseEffect Hook 
    useEffect(() => {
        checkIfWalletIsConnected();
    }, []);

    return (
        <TruecallerContext.Provider value={{ connectWallet, currentAccount, formData, handleChange, AddCaller, data, addSpam, handlesearch, searchNumber, searchResult, removeSpam, searchValue, search }}>
            {children}
        </TruecallerContext.Provider>
    );
}