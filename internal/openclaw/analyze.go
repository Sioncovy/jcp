package openclaw

import (
	"context"
	"encoding/json"
	"net/http"
	"time"

	"github.com/run-bigpig/jcp/internal/meeting"
	"github.com/run-bigpig/jcp/internal/models"
)

// AnalyzeRequest 分析请求
type AnalyzeRequest struct {
	StockCode string   `json:"stockCode"`
	Query     string   `json:"query"`
	AgentIDs  []string `json:"agentIds"` // 可选，指定专家
}

func (s *Server) handleAnalyze(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		writeJSON(w, http.StatusMethodNotAllowed, map[string]any{"error": "method not allowed"})
		return
	}

	var req AnalyzeRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]any{"error": "invalid request"})
		return
	}

	if req.StockCode == "" || req.Query == "" {
		writeJSON(w, http.StatusBadRequest, map[string]any{"error": "stockCode and query required"})
		return
	}

	// 获取 AI 配置
	aiConfig := s.aiResolver("")
	if aiConfig == nil {
		writeJSON(w, http.StatusServiceUnavailable, map[string]any{"error": "AI not configured"})
		return
	}

	// 获取专家
	var agents []*models.AgentConfig
	if len(req.AgentIDs) > 0 {
		for _, id := range req.AgentIDs {
			if a := s.agentContainer.GetAgent(id); a != nil {
				cfg := &models.AgentConfig{ID: a.GetID(), Name: a.GetName(), Role: a.GetRole(), Instruction: a.GetInstruction()}
				agents = append(agents, cfg)
			}
		}
	} else {
		for _, a := range s.agentContainer.GetAllAgents() {
			cfg := &models.AgentConfig{ID: a.GetID(), Name: a.GetName(), Role: a.GetRole(), Instruction: a.GetInstruction()}
			agents = append(agents, cfg)
		}
	}

	if len(agents) == 0 {
		writeJSON(w, http.StatusBadRequest, map[string]any{"error": "no agents available"})
		return
	}

	// 构建请求
	agentConfigs := make([]models.AgentConfig, len(agents))
	for i, a := range agents {
		agentConfigs[i] = *a
	}

	chatReq := meeting.ChatRequest{
		Stock:     models.Stock{Symbol: req.StockCode},
		Agents:    agentConfigs,
		AllAgents: agentConfigs,
		Query:     req.Query,
	}

	ctx, cancel := context.WithTimeout(r.Context(), 5*time.Minute)
	defer cancel()

	results, err := s.meetingService.RunSmartMeeting(ctx, aiConfig, chatReq)
	if err != nil {
		log.Error("分析失败: %v", err)
		writeJSON(w, http.StatusInternalServerError, map[string]any{"error": err.Error()})
		return
	}

	writeJSON(w, http.StatusOK, map[string]any{"success": true, "results": results})
}
