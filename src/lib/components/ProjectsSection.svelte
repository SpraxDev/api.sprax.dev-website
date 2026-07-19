<script lang="ts">
  import projectsData from '$lib/data/projects.json';

  interface Project {
    name: string;
    description: string;
    /** Optional — some projects have no (working) website */
    url?: string;
    repo?: string;
    /** File name inside src/lib/assets/projects/ — optional */
    logo?: string;
  }

  const projects: Project[] = projectsData;

  // Logos live in the repo and are bundled by Vite — no external image
  // requests, and a renamed/removed file simply renders the card without
  // a logo instead of producing a dead <img>.
  const logos = import.meta.glob('$lib/assets/projects/*', {
    eager: true,
    query: '?url',
    import: 'default'
  }) as Record<string, string>;

  function logoUrl(fileName: string | undefined): string | undefined {
    if (fileName == null) return undefined;
    return Object.entries(logos).find(([path]) => path.endsWith(`/${fileName}`))?.[1];
  }

  const ADD_PROJECT_URL =
    'https://github.com/SpraxDev/api.sprax.dev-website/edit/main/src/lib/data/projects.json';
</script>

<div class="grid">
  {#each projects as project (project.name)}
    {@const logo = logoUrl(project.logo)}
    <article class="project">
      <h3>
        {#if logo != null}
          <img class="logo" src={logo} alt="" width="24" height="24" loading="lazy" />
        {/if}
        {project.name}
      </h3>
      <p>{project.description}</p>
      {#if project.url != null || project.repo != null}
        <div class="links">
          {#if project.url != null}
            <a href={project.url} target="_blank" rel="noopener noreferrer">website</a>
          {/if}
          {#if project.repo != null}
            <a href={project.repo} target="_blank" rel="noopener noreferrer">source</a>
          {/if}
        </div>
      {/if}
    </article>
  {/each}

  <a class="project add" href={ADD_PROJECT_URL} target="_blank" rel="noopener noreferrer">
    <h3>Add your project</h3>
    <p>Using the API in your project? Open a pull request to get listed here.</p>
  </a>
</div>

<style>
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(16rem, 100%), 1fr));
    gap: var(--space-4);
  }

  .project {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius);
    padding: var(--space-4);
    transition: border-color 0.3s;
  }

  .project:hover {
    border-color: color-mix(in srgb, var(--glow-a) 55%, var(--color-border));
  }

  h3 {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    font-family: var(--font-display);
    font-size: var(--text-sm);
    letter-spacing: 0.04em;
    margin: 0;
  }

  .logo {
    width: 24px;
    height: 24px;
    object-fit: contain;
  }

  p {
    margin: 0;
    font-size: var(--text-sm);
    color: var(--color-text-muted);
    flex: 1;
  }

  .links {
    display: flex;
    gap: var(--space-4);
  }

  .links a {
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    color: var(--color-text-muted);
    text-decoration: underline;
    text-underline-offset: 3px;
  }

  .links a:hover {
    color: var(--color-accent);
  }

  .add {
    border-style: dashed;
    text-decoration: none;
  }

  .add h3 {
    color: var(--color-accent);
  }
</style>
