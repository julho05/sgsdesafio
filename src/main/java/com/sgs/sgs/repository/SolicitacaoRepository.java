package com.sgs.sgs.repository;

import com.sgs.sgs.entity.Solicitacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface SolicitacaoRepository extends JpaRepository<Solicitacao, Long> {

    @Query(value = """
            SELECT
                sol.id,
                sol.descricao,
                sol.valor,
                sol.data_solicitacao,
                sol.status,
                s.nome           AS nome_solicitante,
                s.cpf_cnpj       AS documento_solicitante,
                c.nome           AS nome_categoria
            FROM solicitacao sol
            INNER JOIN solicitante s ON sol.solicitante_id = s.id
            INNER JOIN categoria   c ON sol.categoria_id   = c.id
            WHERE (:status      IS NULL OR sol.status            = :status)
              AND (:dataInicio  IS NULL OR sol.data_solicitacao  >= :dataInicio)
              AND (:dataFim     IS NULL OR sol.data_solicitacao  <= :dataFim)
              AND (:categoriaId IS NULL OR sol.categoria_id      = :categoriaId)
            ORDER BY sol.data_solicitacao DESC
            """,
            nativeQuery = true)
    List<Object[]> listarComFiltros(
            @Param("status")      String status,
            @Param("dataInicio")  LocalDate dataInicio,
            @Param("dataFim")     LocalDate dataFim,
            @Param("categoriaId") Long categoriaId
    );
}