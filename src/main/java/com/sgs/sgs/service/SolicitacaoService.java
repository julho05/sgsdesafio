package com.sgs.sgs.service;

import com.sgs.sgs.entity.Categoria;
import com.sgs.sgs.entity.Solicitacao;
import com.sgs.sgs.entity.Solicitante;
import com.sgs.sgs.enums.StatusSolicitacao;
import com.sgs.sgs.repository.CategoriaRepository;
import com.sgs.sgs.repository.SolicitacaoRepository;
import com.sgs.sgs.repository.SolicitanteRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class SolicitacaoService {

    private final SolicitacaoRepository solicitacaoRepository;
    private final SolicitanteRepository solicitanteRepository;
    private final CategoriaRepository   categoriaRepository;

    public SolicitacaoService(SolicitacaoRepository solicitacaoRepository,
                              SolicitanteRepository solicitanteRepository,
                              CategoriaRepository   categoriaRepository) {
        this.solicitacaoRepository = solicitacaoRepository;
        this.solicitanteRepository = solicitanteRepository;
        this.categoriaRepository   = categoriaRepository;
    }

    public Solicitacao cadastrar(Long solicitanteId, Long categoriaId,
                                 String descricao, BigDecimal valor) {

        Solicitante solicitante = solicitanteRepository.findById(solicitanteId)
                .orElseThrow(() -> new IllegalArgumentException("Solicitante não encontrado"));

        Categoria categoria = categoriaRepository.findById(categoriaId)
                .orElseThrow(() -> new IllegalArgumentException("Categoria não encontrada"));

        Solicitacao solicitacao = new Solicitacao();
        solicitacao.setSolicitante(solicitante);
        solicitacao.setCategoria(categoria);
        solicitacao.setDescricao(descricao);
        solicitacao.setValor(valor);
        solicitacao.setDataSolicitacao(LocalDate.now());
        solicitacao.setStatus(StatusSolicitacao.SOLICITADO);

        return solicitacaoRepository.save(solicitacao);
    }

    public Solicitacao atualizarStatus(Long id, StatusSolicitacao novoStatus) {

        Solicitacao solicitacao = solicitacaoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Solicitação não encontrada"));

        StatusSolicitacao statusAtual = solicitacao.getStatus();

        if (!transicaoPermitida(statusAtual, novoStatus)) {
            throw new IllegalStateException(
                    "Transição inválida: " + statusAtual + " → " + novoStatus
            );
        }

        solicitacao.setStatus(novoStatus);
        return solicitacaoRepository.save(solicitacao);
    }

    private boolean transicaoPermitida(StatusSolicitacao atual, StatusSolicitacao novo) {
        return switch (atual) {
            case SOLICITADO -> novo == StatusSolicitacao.LIBERADO
                    || novo == StatusSolicitacao.REJEITADO;
            case LIBERADO   -> novo == StatusSolicitacao.APROVADO
                    || novo == StatusSolicitacao.REJEITADO;
            case APROVADO   -> novo == StatusSolicitacao.CANCELADO;
            case REJEITADO, CANCELADO -> false;
        };
    }

    public List<Map<String, Object>> listar(String status, LocalDate dataInicio,
                                            LocalDate dataFim, Long categoriaId) {

        List<Object[]> rows = solicitacaoRepository.listarComFiltros(
                status, dataInicio, dataFim, categoriaId
        );

        return rows.stream().map(row -> {
            Map<String, Object> item = new HashMap<>();
            item.put("id",                   row[0]);
            item.put("descricao",            row[1]);
            item.put("valor",                row[2]);
            item.put("dataSolicitacao",      row[3] != null ? row[3].toString() : null);
            item.put("status",               row[4]);
            item.put("nomeSolicitante",      row[5]);
            item.put("documentoSolicitante", row[6]);
            item.put("nomeCategoria",        row[7]);
            return item;
        }).toList();
    }

    public Solicitacao buscarPorId(Long id) {
        return solicitacaoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Solicitação não encontrada"));
    }

    public List<Solicitante> listarSolicitantes() {
        return solicitanteRepository.findAll();
    }

    public List<Categoria> listarCategorias() {
        return categoriaRepository.findAll();
    }

    public Solicitacao editar(Long id, Long solicitanteId, Long categoriaId,
                              String descricao, BigDecimal valor) {

        Solicitacao solicitacao = solicitacaoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Solicitação não encontrada"));

        Solicitante solicitante = solicitanteRepository.findById(solicitanteId)
                .orElseThrow(() -> new IllegalArgumentException("Solicitante não encontrado"));

        Categoria categoria = categoriaRepository.findById(categoriaId)
                .orElseThrow(() -> new IllegalArgumentException("Categoria não encontrada"));

        solicitacao.setSolicitante(solicitante);
        solicitacao.setCategoria(categoria);
        solicitacao.setDescricao(descricao);
        solicitacao.setValor(valor);

        return solicitacaoRepository.save(solicitacao);
    }
}