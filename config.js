// ---------------------------------------------------------------
// Robinhood Chain settings — edit these two addresses and every
// link, chart embed, and the displayed CA update automatically.
// ---------------------------------------------------------------
const NEKOPAN_CONFIG = {
  // ERC-20 token contract address on Robinhood Chain
  tokenAddress: "0x0000000000000000000000000000000000000000",
  // Liquidity pool address on Robinhood Chain (used for the GeckoTerminal chart)
  poolAddress: "0x0000000000000000000000000000000000000000",
  // GeckoTerminal network slug for Robinhood Chain
  network: "robinhood",
  // Robinhood Chain block explorer (Blockscout)
  explorer: "https://robinhoodchain.blockscout.com",
};

(function applyConfig() {
  const c = NEKOPAN_CONFIG;
  const poolUrl = `https://www.geckoterminal.com/${c.network}/pools/${c.poolAddress}`;
  const chartEmbed = `${poolUrl}?embed=1&info=1&swaps=1&grayscale=0&light_chart=0`;
  const explorerToken = `${c.explorer}/token/${c.tokenAddress}`;

  document.querySelectorAll("[data-link-buy]").forEach((el) => (el.href = poolUrl));
  document.querySelectorAll("[data-link-chart]").forEach((el) => (el.href = poolUrl));
  document.querySelectorAll("[data-link-explorer]").forEach((el) => (el.href = explorerToken));
  document.querySelectorAll("[data-chart-iframe]").forEach((el) => (el.src = chartEmbed));
  document.querySelectorAll("[data-token-ca]").forEach((el) => (el.textContent = c.tokenAddress));

  // Click the CA box to copy it
  document.querySelectorAll("[data-token-ca]").forEach((el) => {
    el.style.cursor = "pointer";
    el.title = "Click to copy";
    el.addEventListener("click", () => {
      navigator.clipboard.writeText(c.tokenAddress).then(() => {
        const prev = el.textContent;
        el.textContent = "copied!";
        setTimeout(() => (el.textContent = prev), 900);
      });
    });
  });
})();
