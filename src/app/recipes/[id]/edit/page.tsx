import TopBar from "@/components/ui/TopBar";
import BottomTabs from "@/components/ui/BottomTabs";
import EditRecipeForm from "@/components/recipe/EditRecipeForm";

export default async function EditRecipePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params; // ✅ в Server Component можно await params

  return (
    <>
      <TopBar />
      <main className="container-narrow section">
        <h1 className="h5 my-2">Редактировать рецепт</h1>
        <EditRecipeForm id={id} />
      </main>
      <BottomTabs />
    </>
  );
}
