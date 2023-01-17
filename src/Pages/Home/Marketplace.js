import React, { useEffect, useState, useRef } from "react";


import * as s from "./Marketplacecss";
import { uploadFileToIPFS, uploadJSONToIPFS } from "../../script/pinata.js";
import Marketplace from '../../script/Marketplace.json';


function Home() {

    const [formParams, updateFormParams] = useState({ name: '', description: '' ,external_url:''});
    const [fileURL, setFileURL] = useState(null);
    const ethers = require("ethers");
    const [message, updateMessage] = useState('');
    const [disableButton,setDisableButton]=useState(true)


    async function OnChangeFile(e) {
       
        var file = e.target.files[0];
        //check for file extension
        try {
            //upload the file to IPFS
            const response = await uploadFileToIPFS(file);
            if (response.success === true) {
                console.log("Uploaded image to Pinata: ", response.pinataURL)
                setFileURL(response.pinataURL);
                setDisableButton(false)
            }
        }
        catch (e) {
            console.log("Error during file upload", e);
        }
    }


    //This function uploads the metadata to IPFS
    async function uploadMetadataToIPFS() {
        const { name, description,external_url } = formParams;
        //Make sure that none of the fields are empty
        if (!name || !description  || !fileURL)
            return;

        const nftJSON = {
            name, description,external_url, image: fileURL
        }

        try {
            //upload the metadata JSON to IPFS
            const response = await uploadJSONToIPFS(nftJSON);
            if (response.success === true) {
                console.log("Uploaded JSON to Pinata: ", response)
                return response.pinataURL;
            }
        }
        catch (e) {
            console.log("error uploading JSON metadata:", e)
        }
    }


    async function mintNFT(e) {
        e.preventDefault();

        //Upload data to IPFS
        try {
            const metadataURL = await uploadMetadataToIPFS();
            //After adding your Hardhat network to your metamask, this code will get providers and signers
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            updateMessage("Please wait.. uploading (upto 5 mins)")

            //Pull the deployed contract instance
            let contract = new ethers.Contract(Marketplace.address, Marketplace.abi, signer)



            //actually create the NFT
            let transaction = await contract.mintNFT(metadataURL)
            await transaction.wait()

            alert("Successfully Minted your NFT!");
            updateMessage("");
            updateFormParams({ name: '', description: '', external_url: '' });
            window.location.replace("/")
        }
        catch (e) {
            alert("Upload error" + e)
        }
    }

    return (
        <>

            <s.Container flex={1} ai={"center"} style={{ paddingTop: 30 }}>


                <s.ResponsiveWrapper flex={1} test>

                    <h1 style={{ marginBottom: "0px" }}>Create New Item</h1>
                    <s.TextInfo> * Required fields</s.TextInfo>
                    <s.TextSubTitle>Image, Video, Audio, or 3D Model *</s.TextSubTitle>
                    <s.TextInfo> File types supported: JPG, PNG, GIF, SVG, MP4, WEBM, MP3, WAV, OGG, GLB, GLTF. Max size: 100 MB</s.TextInfo>

                    <s.uploadInput onChange={OnChangeFile} type="file" name="file"  id="fileid" />

                    <s.TextSubTitle>Name *</s.TextSubTitle>
                   
                    <s.nftInput type="text" name="name" placeholder="Item Name" onChange={e => updateFormParams({ ...formParams, name: e.target.value })} value={formParams.name} />

                    <s.TextSubTitle>External link</s.TextSubTitle>
                    <s.TextInfo>OpenSea will include a link to this URL on this item's detail page, so that users can click to learn more about it. You are welcome to link to your own webpage with more details.</s.TextInfo>

                    <s.nftInput type="text" name="externallink" placeholder="https://yoursite.io/" value={formParams.external_url} onChange={e => updateFormParams({ ...formParams, external_url: e.target.value })} />

                    <s.TextSubTitle>Description</s.TextSubTitle>
                    <s.TextInfo>The description will be included on the item's detail page underneath its image. Markdown syntax is supported.</s.TextInfo>
                    <s.nftInput type="text" name="description" placeholder="Description" value={formParams.description} onChange={e => updateFormParams({ ...formParams, description: e.target.value })}  />

                   

                    <s.StyledButton onClick={mintNFT} disabled={disableButton} className="">
                        Mint NFT
                    </s.StyledButton>
                    <s.TextInfo>Upload Image to enable Mint Button</s.TextInfo>


                </s.ResponsiveWrapper>


            </s.Container>

        </>

    );
}

export default Home;
