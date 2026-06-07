export interface UpdateAboutPayload {
  name?: string;
  role?: string;
  bio?: string;
  profile_picture?: string;
  profile_picture_public_id?: string;
  cv_url?: string;
  status?: "available" | "not_available";
}
