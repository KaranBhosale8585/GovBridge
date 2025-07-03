import Link from "next/link";

export default function Home() {
  return (
    <div className="container boardr">
      <div className="row">
        <div className="col-md-12">
          <div className="text-center">
            <div className="flex flex-col items-center justify-center">
              <h1 className="text-3xl font-bold">CivicSync</h1>
              <p className="text-lg">
                A simple and secure way to sync your calendars with your
                friends.
                <br />
                <span className="text-sm text-gray-500">
                  Built with Next.js, MongoDB, and TypeScript.
                </span>
              </p>
              <Link href="/register">Register</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
