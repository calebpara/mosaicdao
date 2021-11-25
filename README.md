# MosaicDAO

MosaicDAO is an experimental take on collaborative art curation. Through ownership of governance tokens, user can vote on proposals to modify a gallery, which functions as a modifiable NFT. https://www.mosaicdao.xyz/

Web3Jam Entry: https://showcase.ethglobal.com/web3jam/mosaicdao (Protocol Labs Best Decentralized Media Hack 2nd Place).

## Description 

This project is built to explore the intersection of collaborative art and financial incentives. Users can use their ERC20 governance tokens to manage a collective piece of art - a gallery NFT, through voting on proposals to append or remove images from the gallery. By participating in governance, users can directly influence the content and clout of the NFT piece and consequently the value of their tokens, creating an incentive alignment that we believe will jumpstart collaborative art curation.

In the future we plan to implement an intuitive interface that allows users to fundraise and create new galley DAOs with any specified theme/subject. Each gallery will have their own governance tokens and liquidity pool.

## Tech Stack
- Frontend - web3.js, React.js
- Server - AWS 
- Backend - Polygon, IPFS (Web3.Storage) 

## Available Scripts

In the project directory, you can run:

### `npm run start`

Runs the frontend DApp in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `export PORT=3001 && cd server && npm run start`

Runs the REST API Server that fetches on-chain data to generate gallery image .\
Open [http://localhost:3001](http://localhost:3001) to view it in the browser.

For the DApp to load from the server, modify src/api/constants.js. You can configure the networks variable in server/index.js for the server to fetch data from different chains.

