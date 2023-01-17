
import { Link, } from "react-router-dom";
import { BrowserRouter as Router } from "react-router-dom";


function NFTTile(data) {

    const newTo = {
        pathname: "/nftpage/" + data.data.tokenId
    }
    return (

        <Link to={newTo} >
            <div className="border-2 ml-12 mt-4 mb-4 flex flex-col items-center rounded-lg w-48 md:w-72 shadow-2xl">
                <img src={data.data.image} alt="" style={{ width: "100px" }} className="w-30 h-30 rounded-lg object-cover" />

                <div className=" w-full p-2 bg-gradient-to-t from-[#454545] to-transparent rounded-lg ">
                    <h3 className="text-xl">Token ID:{data.data.tokenId}</h3>

                </div>
            </div>
        </Link>

    )
}

export default NFTTile;