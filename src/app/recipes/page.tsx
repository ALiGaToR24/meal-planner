import TopNav from "@/components/ui/TopBar";
import BottomTabs from "@/components/ui/BottomTabs";
import RecipeCard from "@/components/recipe/RecipeCard";

const mock = [
  {id:"1", title:"Овсянка с ягодами", time:12, tags:["быстро","дёшево"]},
  {id:"2", title:"Курица + рис", time:25, tags:["P-friendly"]},
  {id:"3", title:"Лосось и овощи", time:20, tags:["ужин"]},
];

export default function RecipesPage(){
  return (
    <>
      <TopNav />
      <main className="container-narrow section">
        <div className="d-flex align-items-center justify-content-between my-2">
          <h1 className="h5 m-0">Рецепты</h1>
          <a className="btn btn-sm btn-brand" href="#"><i className="bi bi-plus-lg me-1" />Добавить</a>
        </div>
        <div className="row g-3">
          {mock.map(r=>(
            <div className="col-12 col-sm-6 col-lg-4" key={r.id}><RecipeCard {...r}/></div>
          ))}
        </div>
      </main>
      <BottomTabs/>
    </>
  );
}
