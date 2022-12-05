import uuid from "node-uuid";

export interface StructuredReference {
    id: string,
    'AParaitre': string,
    'Auteur': string,
    'DatePublication': string,
    'EditeurCommercial': string,
    'EditeurScientifique': string,
    'LieuPublication': string,
    'Numero': string,
    'Pages': string,
    'Titre': string,
    'TitreOuvrageCollectif': string,
    'TitreRevue': string,
    'Volume': 'volume'
}

export class Reference {

    private readonly _id: string;
    private readonly _fullText: string;
    private _structured: StructuredReference;

    constructor(fullText: string) {
        this._fullText = fullText;
        this._id = uuid.v4();
    }

    get id(): string {
        return this._id;
    }


    get fullText(): string {
        return this._fullText;
    }

    get structured(): StructuredReference {
        return this._structured;
    }

    set structured(value: StructuredReference) {
        this._structured = value;
    }
}