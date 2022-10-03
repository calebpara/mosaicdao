import { MosaicERC20 } from "../types/MosaicERC20";
import { MosaicDAO } from "../types/MosaicDAO";
import { MosaicGovernor } from "../types/MosaicGovernor";
import { TokenAirDrop } from "../types/TokenAirDrop";

export interface IContractsList {
  MosaicDAO: MosaicDAO;
  MosaicERC20: MosaicERC20;
  MosaicGovernor: MosaicGovernor;
  TokenAirDrop: TokenAirDrop;
}

export type { MosaicERC20, TokenAirDrop, MosaicDAO, MosaicGovernor };
