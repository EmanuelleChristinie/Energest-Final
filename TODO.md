# TODO - Correções Energest

- [ ] 1) Validar estrutura do backend (arquivos principais, rotas, caminhos do modelo/CSV)
- [ ] 2) Corrigir `Energest/backend/requirements.txt` para UTF-8 e listar dependências completas
- [ ] 3) Corrigir `Energest/backend/Dockerfile` para usar `requirements.txt` (sem sobrescrever com lista parcial)
- [ ] 4) Padronizar carregamento do `model.pkl` e `energy_data.csv` em `Energest/backend/app/main.py` e `predict_service.py`
- [ ] 5) Garantir que `fix_ia.py` salva também o CSV esperado por `main.py`/`EnergyAnalyzer`
- [x] 6) Rodar `pip install -r requirements.txt` (ambiente local) e executar `python fix_ia.py`

- [ ] 7) Rodar `pytest` do backend
- [ ] 8) Subir a API com `uvicorn app.main:app --reload` e executar chamadas básicas (smoke test)

