export interface Iuser {
  _id: string;
  name: string;
  email: string;
  password?: string;
  profilePicture?: string;
  bio?: string;
  followers?: string[];
  following?: string[];
  posts?: IPost[];
  savePosts?: string[] | IPost[];
  isVarified: boolean|null;
}

export interface IComment {
  _id: string;
  text?: string;
  user: {
    _id: string;
    name: string;
    profilePicture: string;
  };
  createdAt: string;
}

export interface Ipost {
    _id:string
  caption?: string; 
  image: {
    url: string;
    publicId: string;
  };
  user: Iuser | undefined;
  likes: string[];
  comments:IComment[];
  createdAt: string;
}

export interface ICreatePostResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: IPost;
}

export interface ILikeOrDislikeResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: {
    isLiked:boolean
  };
}

export interface ISaveOrUnsaveResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: {
    isPostSaved:boolean
    user:Iuser
  };
}

export interface IGetAllPostResponse{
  success: boolean;
  message: string;
  statusCode: number;
  data:{
    posts: Ipost[],
    postLength: number
  } ;
  postLength:number
}

export interface ICommentResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: {
    _id: string;
    text: string;
    user: {
      _id: string;
      name: string;
      profilePicture: string;
      bio: string;
    };
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
}

export interface IFollowUnfollowResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: Iuser;
}
export interface IPostDeleteResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: Iuser;
}

