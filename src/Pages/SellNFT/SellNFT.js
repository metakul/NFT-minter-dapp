
import NFTTile from "./NFTTile";
import MarketplaceJSON from '../../script/Marketplace.json';
import axios from "axios";
import { useState } from "react";

export default function SellNFT() {
   
    const [data, updateData] = useState([]);
    const [dataFetched, updateFetched] = useState(false);

    async function getAllNFTs() {
        const ethers = require("ethers");

        

        //After adding your Hardhat network to your metamask, this code will get providers and signers
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        //Pull the deployed contract instance
        let contract = new ethers.Contract(MarketplaceJSON.address, MarketplaceJSON.abi, signer)
        //create an NFT Token
        let transaction = await contract.getAllNFTs()

        //Fetch all the details of every NFT from the contract and display
        const items = await Promise.all(transaction.map(async i => {
            const tokenURI = await contract.tokenURI(i.tokenId);
            
            const resp = await axios.get(tokenURI, {
                headers: {
                    'Accept': 'application/json'
                }
            })

            console.log(resp.data)

            const metadata = resp.data

           
            
            let item = {
                
                tokenId: i.tokenId.toNumber(),
                name: metadata.name,
                description: metadata.description,
                owner: i.owner,
                image: metadata.image,
               
            }
            return item;
        }))

        updateFetched(true);
        updateData(items);
    }

    if (!dataFetched)
        getAllNFTs();

    return (
        <div>
           
            <div className="flex text-center flex-col place-items-center mt-20">
                <h2 className="md:text-xl font-bold ">
                    All NFTs
                </h2>
                <div className="flex mt-5 justify-between flex-wrap max-w-screen-xl text-center">
                    {data.map((value, index) => {
                        return <NFTTile data={value} key={index}></NFTTile>;
                    })}
                </div>
            </div>
        </div>
    );

}