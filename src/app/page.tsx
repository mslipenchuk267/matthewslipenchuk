import Image from "next/image";
import TriangleNetwork from "./components/TriangleNetwork";

export default function Home() {
  const glassTile =
    "bg-opacity-90 shadow-sm backdrop-filter backdrop-blur-[3px] rounded-md p-6 border border-gray-200";
  const skillTile =
    "bg-opacity-90 shadow-sm backdrop-filter backdrop-blur-[3px] border-gray-300 border rounded-md px-3 py-1 text-sm w-fit inline-block";
  const cloudSkillTile = `${skillTile} w-full text-center`;

  return (
    <div className="min-h-screen font-sans">
      <TriangleNetwork />
      {/* Hero Section */}
      <section className="py-20 pb-5 px-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
          <div className="w-72 h-72 rounded-full overflow-hidden border border-gray-300 shadow-lg">
            <Image
              src="/profile_film.jpeg"
              alt="Profile"
              width={288}
              height={288}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="text-left">
            <h1 className="text-5xl font-bold mb-2 text-gray-900">
              Matthew Slipenchuk
            </h1>
            <p className="text-xl text-gray-700">Software Engineer</p>
            <div className="text-left flex gap-4 mt-8">
              <a
                href="mailto:mslipenchuk267@gmail.com"
                className="inline-block backdrop-filter backdrop-blur-[3px] border border-blue-300 hover:bg-blue-100 hover:text-blue-900 font-medium py-2 px-4 rounded-md shadow transition"
              >
                Email
              </a>
              <a
                href="https://www.linkedin.com/in/matthew-slipenchuk/"
                target="_blank"
                className="inline-block backdrop-filter backdrop-blur-[3px] border border-blue-300 hover:bg-blue-100 hover:text-blue-900 font-medium py-2 px-4 rounded-md shadow transition"
              >
                LinkedIn
              </a>
              <a
                href="https://github.com/mslipenchuk267"
                target="_blank"
                className="inline-block backdrop-filter backdrop-blur-[3px] border border-blue-300 hover:bg-blue-100 hover:text-blue-900 font-medium py-2 px-4 rounded-md shadow transition"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Main Section */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 my-16 px-6">
        {/* Left Side - Cards */}
        <div className="space-y-6">
          {/* About Card */}
          <div className={glassTile}>
            <h2 className="text-2xl font-semibold mb-3">About Me</h2>
            <p>
              I&apos;m a Software Engineer with 7 years of experience in
              FDA-regulated medical device and healthcare development, including
              Class III device software, 510(k), and IDE filings across 7
              submissions. My work spans from sensor systems and embedded
              firmware to industrial desktop applications, cloud-native
              services, ML/RL pipelines, and agent solutions. I&apos;ve led
              frontend and backend teams, taken devices from initial prototyping
              through benchtop characterization, ML calibration, and wet lab
              validation. I am no stranger to stepping into products
              mid-development, replacing engines while keeping the software
              program and timelines in flight.
            </p>
            <br />
            <p>
              I am currently based in Philadelphia, Pennsylvania. Outside of
              work, I enjoy writing poetry, playing guitar, painting, film
              photography, and watching movies.
            </p>
          </div>

          {/* What I'm Working On Card */}
          <div className={glassTile}>
            <h2 className="text-2xl font-semibold mb-3">
              What I&apos;m Working On
            </h2>
            <p>
              I&apos;m building a multi-agent workspace based on Andrej
              Karpathy&apos;s{" "}
              <a
                href="https://x.com/karpathy/status/2039805659525644595"
                target="_blank"
                className="text-blue-700 underline hover:no-underline"
              >
                LLM Wiki
              </a>{" "}
              concept. Specialized agents conduct research, analyze your
              documents, and write code, then compile the output into a clean,
              interlinked Markdown wiki with an evolving ontology. All code
              execution runs in sandboxed microVMs, and a human-in-the-loop
              workflow ensures you review every staged diff or summary before it
              commits. You can kick off deep research, request custom analysis,
              or query the entire history through Slack or WhatsApp. Because
              every interaction feeds back into the graph, the system builds
              persistent context that gets more useful the longer you run it.
            </p>
            <br />
            <p>
              I am also building a product in the attestation and provenance
              space to aid post-AI org charts at my company{" "}
              <a
                href="https://vadum.io"
                target="_blank"
                className="text-blue-700 underline hover:no-underline"
              >
                Vadum
              </a>
              , where I also offer software &amp; device engineering
              consultation, as well as custom agent integrations, harnessing,
              and RAG solutions.
            </p>
            <ul className="flex flex-wrap gap-2 mt-4">
              {[
                "OpenAI API",
                "Anthropic API",
                "Deepseek API",
                "Gemini API",
                "OpenRouter",
              ].map((tool) => (
                <li key={tool} className={skillTile}>
                  {tool}
                </li>
              ))}
            </ul>
          </div>

          {/* Paper Card */}
          <div className={glassTile}>
            <h2 className="text-2xl font-semibold mb-3">Publications</h2>
            <a
              href="https://www.nature.com/articles/s41390-024-03287-0"
              className="text-blue-700 underline hover:no-underline"
              target="_blank"
            >
              &quot;Assessment of Extremely Premature Lambs Supported by the
              Extrauterine Environment for Neonatal Development (EXTEND)&quot;
            </a>
            <p>Nature, Pediatric Research 2024.</p>
          </div>

          {/* Patent Card */}
          <div className={glassTile}>
            <h2 className="text-2xl font-semibold mb-3">Patents</h2>
            <a
              href="https://patents.justia.com/patent/20250360251"
              className="text-blue-700 underline hover:no-underline"
              target="_blank"
            >
              &quot;Method and Device for Measuring Oxygen Saturation&quot;
            </a>
            <p>International Patent Publication No. 20250360251</p>
            <p>Publication Date: Nov. 27, 2025. </p>
          </div>
        </div>

        {/* Right Side - Timeline */}
        <div className="relative pl-8">
          <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gray-300"></div>

          {/* Languages */}
          <div className="mb-10 relative">
            <h3 className="font-semibold text-lg mb-2">Languages</h3>
            <ul className="flex flex-wrap gap-2">
              {[
                "C++ 11/17",
                "Python",
                "TypeScript",
                "JavaScript",
                "Golang",
                "R",
                "C",
                "Matlab",
                "Ruby",
                "Bash",
              ].map((lang) => (
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
              {[
                "FastAPI",
                "React",
                "Next.js",
                "Qt",
                "Vue",
                "React Native",
                "Flask",
                "Ruby on Rails",
              ].map((framework) => (
                <li key={framework} className={skillTile}>
                  {framework}
                </li>
              ))}
            </ul>
          </div>

          {/* Agentic Engineering */}
          <div className="mb-10 relative">
            <h3 className="font-semibold text-lg mb-2">Agentic Engineering</h3>
            <ul className="flex flex-wrap gap-2">
              {["Claude Code", "Codex", "Amp Code"].map((tool) => (
                <li key={tool} className={skillTile}>
                  {tool}
                </li>
              ))}
            </ul>
          </div>

          {/* Databases */}
          <div className="mb-10 relative">
            <h3 className="font-semibold text-lg mb-2">Databases</h3>
            <ul className="flex flex-wrap gap-2">
              {[
                "PostgreSQL",
                "SQLite",
                "Redis",
                "DuckDB",
                "PySpark",
                "Databricks",
              ].map((db) => (
                <li key={db} className={skillTile}>
                  {db}
                </li>
              ))}
            </ul>
          </div>

          {/* Infrastructure */}
          <div className="mb-10 relative">
            <h3 className="font-semibold text-lg mb-2">Infrastructure</h3>
            <ul className="flex flex-wrap gap-2">
              {[
                "Docker",
                "Docker Compose",
                "Terraform",
                "Kubernetes",
                "KinD",
                "Knative",
                "Kourier",
              ].map((tech) => (
                <li key={tech} className={skillTile}>
                  {tech}
                </li>
              ))}
            </ul>
          </div>

          {/* DevOps */}
          <div className="mb-10 relative">
            <h3 className="font-semibold text-lg mb-2">DevOps</h3>
            <ul className="flex flex-wrap gap-2">
              {[
                "Github Actions",
                "Bitbucket Pipelines",
                "OpenTelemetry",
                "Loki",
                "Tempo",
                "Prometheus",
                "Grafana",
              ].map((db) => (
                <li key={db} className={skillTile}>
                  {db}
                </li>
              ))}
            </ul>
          </div>

          {/* Cloud Services */}
          <div className="mb-10 relative w-full max-w-full sm:w-fit inline-block">
            <h3 className="font-semibold text-lg mb-2">Cloud Services</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 w-full max-w-full sm:w-fit gap-4">
              {/* Azure */}
              <div className="backdrop-filter backdrop-blur-xs bg-opacity-90  border border-blue-400 shadow-md rounded-md p-4">
                <h3 className="font-semibold text-lg mb-3 text-blue-800">
                  Azure
                </h3>
                <ul className="flex flex-col gap-2">
                  {[
                    "ADLSv2",
                    "Virtual Machine",
                    "IoT Hub",
                    "ACR",
                    "AKS",
                    "App Service",
                  ].map((service) => (
                    <li key={service} className={cloudSkillTile}>
                      {service}
                    </li>
                  ))}
                </ul>
              </div>

              {/* AWS */}
              <div className="backdrop-filter backdrop-blur-xs bg-opacity-90 border border-orange-400 shadow-md rounded-md p-4">
                <h3 className="font-semibold text-lg mb-3 text-gray-700">
                  AWS
                </h3>
                <ul className="flex flex-col gap-2">
                  {[
                    "S3",
                    "EC2",
                    "Amplify",
                    "ECS",
                    "ELB",
                    "EKS",
                    "CloudFront",
                    "Route 53",
                    "Certificate Manager",
                  ].map((service) => (
                    <li key={service} className={cloudSkillTile}>
                      {service}
                    </li>
                  ))}
                </ul>
              </div>

              {/* GCP */}
              <div className="backdrop-filter backdrop-blur-xs bg-opacity-90 border border-gray-300 shadow-md rounded-md p-4">
                <h3 className="font-semibold text-lg mb-3 text-green-800">
                  GCP
                </h3>
                <ul className="flex flex-col gap-2">
                  {["Firebase", "BigQuery", "Dataform", "Looker"].map(
                    (service) => (
                      <li key={service} className={cloudSkillTile}>
                        {service}
                      </li>
                    ),
                  )}
                </ul>
              </div>
            </div>
          </div>

          {/* IoT Technologies */}
          <div className="mb-10 relative">
            <h3 className="font-semibold text-lg mb-2">IoT</h3>
            <ul className="flex flex-wrap gap-2">
              {["MQTT", "PlatformIO", "Arduino", "Raspberry Pi"].map((tech) => (
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
