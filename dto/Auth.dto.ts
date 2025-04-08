import { BoarderPayload } from "./Boarder.dto";
import { PropertyOwnerPayload } from "./PropertyOwner.dto";
import { VerifierPayload } from "./Verifier.dto";


export type AuthPayload = PropertyOwnerPayload | VerifierPayload | BoarderPayload