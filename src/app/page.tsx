import Image from "next/image";

export default function Home() {
  const glassTile = "bg-white bg-opacity-30 shadow-sm backdrop-filter backdrop-blur-xl rounded-md p-6 border border-gray-200";
  const skillTile = "bg-white bg-opacity-30 shadow-sm backdrop-filter backdrop-blur-xl border-gray-300 border rounded-md px-3 py-1 text-sm w-fit inline-block"
  const cloudSkillTile = `${skillTile} w-full text-center`;

  return (
    <div className="min-h-screen font-sans" style={{ background: 'var(--background)' }}>
      {/* Hero Section */}
      <section className="py-20 pb-5 px-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
          <Image src="/profile.jpeg" alt="Profile" width={288} height={288} className="w-72 h-72 rounded-full border border-gray-300 shadow-lg" />
          <div className="text-left">
            <h1 className="text-5xl font-bold mb-2 text-gray-900">Matthew Slipenchuk</h1>
            <p className="text-xl text-gray-700">Software Generalist.</p>
          </div>
        </div>
      </section>

      {/* Main Section */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 my-16 px-6">
        {/* Left Side - Cards */}
        <div className="space-y-6">
          {/* Description Card */}
          <div className={glassTile}>
            <h2 className="text-2xl font-semibold mb-3">About Me</h2>
            <p className="text-gray-700">I&apos;m a Software Engineer with 6 years of expereince in the healthcare and medical device industry. 
              I have built full-stack solutions across distributed service based architectures. 
              My work spans from embedded systems to cloud services. I have led both frontend and backend teams, implenting secure authentication systems, high-volume data pipelines, and bespoke visualizations.</p>
          </div>

          {/* Paper Card */}
          <div className={glassTile}>
            <h2 className="text-2xl font-semibold mb-3">Publications</h2>
            <p className="text-gray-700">&quot;Assessment of Extremely Premature Lambs Supported by the Extrauterine Environment for Neonatal Development (EXTEND)&quot; Nature, Pediatric Journal 2024.</p>
          </div>

          {/* Patent Card */}
          <div className={glassTile}>
            <h2 className="text-2xl font-semibold mb-3">Patents</h2>
            <p className="text-gray-700">&quot;Method and Device for Measuring Oxygen Saturation&quot;</p>
            <p className="text-gray-700">International Patent Application No. PCT/US2023/067310</p>
          </div>
        </div>

        {/* Right Side - Timeline */}
        <div className="relative pl-8">
          <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gray-300"></div>

          {/* Languages */}
          <div className="mb-10 relative">
            <h3 className="font-semibold text-lg mb-2">Languages</h3>
            <ul className="flex flex-wrap gap-2">
              {['C++ 11/17', 'Python', 'Golang', 'JavaScript', 'TypeScript', 'R', 'C', 'Matlab', 'Ruby', 'VBS', 'HTML', 'CSS', 'Bash'].map((lang) => (
                <li key={lang} className={skillTile}>
                  {lang}
                </li>
              ))}
            </ul>
          </div>

          {/* Frameworks */}
          <div className="mb-10 relative">
            <h3 className="font-semibold text-lg mb-2">Frameworks</h3>
            <ul className="flex flex-wrap gap-2">
              {['Qt', 'Vue', 'FastAPI', 'Next.js', 'React', 'React Native', 'Flask', 'Ruby on Rails'].map((framework) => (
                <li key={framework} className={skillTile}>
                  {framework}
                </li>
              ))}
            </ul>
          </div>

          {/* Databases */}
          <div className="mb-10 relative">
            <h3 className="font-semibold text-lg mb-2">Database Technologies</h3>
            <ul className="flex flex-wrap gap-2">
              {['PostgreSQL', 'SQLite', 'Redis', 'DuckDB', 'Spark', 'Databricks'].map((db) => (
                <li key={db} className={skillTile}>
                  {db}
                </li>
              ))}
            </ul>
          </div>

          {/* Cloud Services */}
          <div className="mb-10 relative w-fit inline-block">
            <h3 className="font-semibold text-lg mb-2">Cloud Services</h3>
            <div className="grid grid-cols-2 w-fit gap-4">
              {/* AWS */}
              <div className="bg-yellow-50 border border-yellow-400 shadow-md rounded-md p-4">
                <h3 className="font-semibold text-lg mb-3 text-yellow-800">AWS</h3>
                <ul className="flex flex-col gap-2">
                  {['S3', 'EC2', 'ECS', 'EKS'].map((service) => (
                    <li key={service} className={cloudSkillTile}>
                      {service}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Azure */}
              <div className="bg-blue-50 border border-blue-400 shadow-md rounded-md p-4">
                <h3 className="font-semibold text-lg mb-3 text-blue-800">Azure</h3>
                <ul className="flex flex-col gap-2">
                  {['Data Lake', 'Virtual Machine', 'IoT Hub', 'App Service', 'Container Registry'].map((service) => (
                    <li key={service} className={cloudSkillTile}>
                      {service}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* IoT Technologies */}
          <div className="mb-10 relative">
            <h3 className="font-semibold text-lg mb-2">IoT</h3>
            <ul className="flex flex-wrap gap-2">
              {['MQTT', 'PlatformIO', 'Arduino', 'Raspberry Pi'].map((tech) => (
                <li key={tech} className={skillTile}>
                  {tech}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
