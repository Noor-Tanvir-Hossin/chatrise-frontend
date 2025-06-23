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
