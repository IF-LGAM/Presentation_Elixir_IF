.PHONY: demo start prompt copy validate generate help

help:
	@echo "⚡ HTML Slide Deck Engine - Commandes disponibles :"
	@echo "  make demo       Ouvre la présentation vitrine dans votre navigateur"
	@echo "  make prompt     Affiche le prompt complet prêt pour l'IA"
	@echo "  make copy       Copie le prompt directement dans votre presse-papiers"
	@echo "  make generate   Génère presentation.html via API LLM"
	@echo "  make validate   Vérifie la conformité du diaporama"

demo:
	node scripts/generate.mjs --open template_presentation.html

start: demo

prompt:
	node scripts/generate.mjs --prompt

copy:
	node scripts/generate.mjs --copy

validate:
	node scripts/generate.mjs --validate template_presentation.html

generate:
	node scripts/generate.mjs --ai
