<template>
  <div>
    <header>
      <nav>
        <div class="nav-brand">
          <NuxtLink to="/">🤖 AI Marketplace</NuxtLink>
        </div>
        <div class="nav-links">
          <NuxtLink to="/">Home</NuxtLink>
          <NuxtLink to="/products">Products</NuxtLink>
          <NuxtLink to="/about">About</NuxtLink>
        </div>
      </nav>
    </header>
    <main>
      <slot />
    </main>
    <footer>
      <p>&copy; 2025 AI Marketplace - JSON Storage System</p>
    </footer>
  </div>
</template>

<style scoped>
header {
  background-color: #00DC82;
  padding: 1rem 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

nav {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-brand a {
  color: white;
  text-decoration: none;
  font-weight: bold;
  font-size: 1.5rem;
}

.nav-links {
  display: flex;
  gap: 2rem;
}

.nav-links a {
  color: white;
  text-decoration: none;
  font-weight: 600;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background 0.2s;
}

.nav-links a:hover,
.nav-links a.router-link-active {
  background: rgba(255, 255, 255, 0.2);
}

main {
  min-height: calc(100vh - 200px);
}

footer {
  margin-top: 4rem;
  padding: 2rem;
  text-align: center;
  background-color: #f5f5f5;
  border-top: 2px solid #00DC82;
}
</style>
