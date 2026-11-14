
export default function MoonbaseAlpha() {
  const officialGameUrl =
    "https://store.steampowered.com/app/39000/Moonbase_Alpha/";

  const openOfficialGame = () => {
    window.open(
      officialGameUrl,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <div className="panel space-y-6 p-6">
      <div className="overflow-hidden rounded-2xl">
        <img
          src="/images/moonbase-alpha.jpg"
          alt="Moonbase Alpha lunar exploration"
          className="h-64 w-full object-cover"
          onError={(event) => {
            event.currentTarget.style.display = "none";
          }}
        />
      </div>

      <div>
        <p className="eyebrow">OFFICIAL SPACE GAME</p>

        <h1 className="mt-2 text-2xl font-bold">
          Moonbase Alpha
        </h1>

        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Explore the official Moonbase Alpha experience.
          Visit the original game page to access the existing
          game developed for lunar exploration education.
        </p>
      </div>

      <button
        onClick={openOfficialGame}
        className="w-full rounded-xl bg-primary px-6 py-4 font-semibold text-primary-foreground hover:opacity-90"
      >
        Play Official Moonbase Alpha ↗
      </button>

      <p className="text-center text-xs text-muted-foreground">
        You will be redirected to the official Steam game page.
      </p>
    </div>
  );
}
