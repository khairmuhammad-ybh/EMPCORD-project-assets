const UserCredential = {
    _id : 'string' | MongoObjectID,
    userId : 'string',
    hashedPassword : 'string'
}

const Roles = ['Master', 'Admin', 'Officer', 'Worker']
const Rights = [
    'IMAdminRights', 'IMrecordCreator', 'IMRecordViewer', 'IMRecordEditor',
    'IMUserCreator', 'IMUserEditor', 'IMUserViewer'
]

const User = {
    _id : 'string' | MongoObjectID,
    userName : 'string',
    name : 'string',
    email : 'string',
    mobile : 'string',
    roles : ['string'],
    rights : ['string'],
    userCredential : UserCredential | 'hasOne'
}

// extends <User>
const Officer = {
    zone : Zone | 'hasOne',
    workers : [Workers] | 'hasMany',
}
//extends <User>
const Worker = {
    officerId : 'string ' | foreignKey,
    records : [Record] | 'hasMany'
}

const Zone = {
    _id : 'string',
    name : 'string',
    officers : [Officer] | 'hasMany',
    blockDirectories : [BlockDirectory] | 'hasMany'
}

const BlockDirectory = {
    _id : 'string' | MongoObjectID,
    blkNumber : 'string',
    address : Address,
    location : Location,
    zoneId : 'string' | foreignKey
}

const Address = {
    blkNumber : 'string',
    streetName : 'string',
    postalCode : 'string'
}
const Location = {
    areaCode : 'string',
    description : 'string'
}


