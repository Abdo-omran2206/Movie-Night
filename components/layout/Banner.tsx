import BannerClientCard from "../cards/BannerClientCards";
import { fetchGenres, fetchMovies } from "@/lib/services/tmdb";
export default async function Banner() {
  
  const data = await fetchMovies("/trending/movie/week",1);
  const genres = await fetchGenres()

  return (
    <div className="w-full max-h-100 h-100 md:max-h-[100svh] md:h-[100svh] max-sm:h-screen relative group">
      <BannerClientCard data={data.results} genres={genres}/>      
    </div>
  );
}

