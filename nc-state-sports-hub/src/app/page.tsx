import GameSchedule from '../components/GameSchedule';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold text-red-600">Welcome to NC State Sports Hub!</h1>
      <p className="text-lg">Your ultimate destination for Wolfpack sports news and updates.</p>
      <GameSchedule />
    </main>
  );
}
