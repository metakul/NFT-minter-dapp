
import { useLocation, useParams } from 'react-router-dom';

import MarketplaceJSON from '../../script/Marketplace.json';
import axios from "axios";
import { useState } from "react";

export default function NFTPage(props) {

    const [data, updateData] = useState({});
    const [dataFetched, updateDataFetched] = useState(false);
    const [message, updateMessage] = useState("");
    const [currAddress, updateCurrAddress] = useState("0x");

    const params = useParams();
    console.log(params)
    const tokenId = params.id;
    if (!dataFetched)
        getNFTData(tokenId);

    async function getNFTData(tokenId) {
        const ethers = require("ethers");
        //After adding your Hardhat network to your metamask, this code will get providers and signers
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const addr = await signer.getAddress();
        //Pull the deployed contract instance
        let contract = new ethers.Contract(MarketplaceJSON.address, MarketplaceJSON.abi, signer)
        //create an NFT Token
        const tokenURI = await contract.tokenURI(tokenId);
        const tokenOwner = await contract.ownerOf(tokenId);
        //let meta = await axios.get(tokenURI);

        const res = await axios.get(tokenURI, {
            headers: {
                'Accept': 'application/json'
            }
        })

        console.log(res.data)

        const metadata = res.data
       
        let item = {
           
            tokenId: tokenId,           
            owner: tokenOwner,
            name: metadata.name,
            image: metadata.image,
            tokenUri: tokenURI,
            description: metadata.description,
        }
       
        updateData(item);
        updateDataFetched(true);
       
        updateCurrAddress(addr);
    }



    

    return (
        <div className="flex text-center flex-col mt-11 text-2xl " style={{ "min-height": "100vh" }}>
           
            <div className="flex ml-20 mt-20">
                <img src={data.image} alt="nft" style={{ width: "300px" }} className="w-2/5" />
                <div className="text-xl ml-20 space-y-8  shadow-2xl rounded-lg border-2 p-5">
                    <h3>
                        tokenId:<span className="text-xl " style={{marginLeft:"10px"}}>{data.tokenId}</span>
                    </h3>
                    <h3>
                        Name:<span className="text-xl " style={{ marginLeft: "10px" }}>{data.name}</span>
                    </h3>
                    <h4>
                        Description:<span className="text-xl " style={{ marginLeft: "10px" }}>{data.description}</span>
                    </h4>
                    <h4>
                        tokenUri: <a target="_blank" href={data.tokenUri}>{data.tokenUri}</a>
                    </h4>
                   
                    <h4>
                        Owner: <span className="text-sm">{data.owner}</span>
                    </h4>
               
                    
                </div>
            </div>
        </div>
    )
}