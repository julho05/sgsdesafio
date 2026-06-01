package com.sgs.sgs.controller;

import com.sgs.sgs.entity.Solicitacao;
import com.sgs.sgs.enums.StatusSolicitacao;
import com.sgs.sgs.service.SolicitacaoService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/solicitacoes")
@CrossOrigin(origins = "*")
public class SolicitacaoController {

    private final SolicitacaoService service;

    public SolicitacaoController(SolicitacaoService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> listar(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataInicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataFim,
            @RequestParam(required = false) Long categoriaId) {

        return ResponseEntity.ok(service.listar(status, dataInicio, dataFim, categoriaId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> buscarPorId(@PathVariable Long id) {
        try {
            Solicitacao s = service.buscarPorId(id);
            Map<String, Object> detalhe = Map.of(
                    "id",               s.getId(),
                    "descricao",        s.getDescricao(),
                    "valor",            s.getValor(),
                    "dataSolicitacao",  s.getDataSolicitacao().toString(),
                    "status",           s.getStatus().name(),
                    "solicitante", Map.of(
                            "id",       s.getSolicitante().getId(),
                            "nome",     s.getSolicitante().getNome(),
                            "cpfCnpj",  s.getSolicitante().getCpfCnpj()
                    ),
                    "categoria", Map.of(
                            "id",   s.getCategoria().getId(),
                            "nome", s.getCategoria().getNome()
                    )
            );
            return ResponseEntity.ok(detalhe);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<?> cadastrar(@RequestBody Map<String, Object> body) {
        try {
            Long solicitanteId = Long.valueOf(body.get("solicitanteId").toString());
            Long categoriaId   = Long.valueOf(body.get("categoriaId").toString());
            String descricao   = body.get("descricao").toString();
            BigDecimal valor   = new BigDecimal(body.get("valor").toString());

            Solicitacao nova = service.cadastrar(solicitanteId, categoriaId, descricao, valor);
            return ResponseEntity.ok(Map.of("id", nova.getId(), "mensagem", "Solicitação cadastrada com sucesso"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage()));
        }
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<?> atualizarStatus(@PathVariable Long id,
                                             @RequestBody Map<String, String> body) {
        try {
            StatusSolicitacao novoStatus = StatusSolicitacao.valueOf(body.get("status"));
            Solicitacao atualizada = service.atualizarStatus(id, novoStatus);
            return ResponseEntity.ok(Map.of(
                    "mensagem", "Status atualizado com sucesso",
                    "novoStatus", atualizada.getStatus().name()
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("erro", "Status inválido: " + body.get("status")));
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage()));
        }
    }

    @GetMapping("/auxiliares")
    public ResponseEntity<Map<String, Object>> auxiliares() {
        return ResponseEntity.ok(Map.of(
                "solicitantes", service.listarSolicitantes(),
                "categorias",   service.listarCategorias()
        ));
    }
}